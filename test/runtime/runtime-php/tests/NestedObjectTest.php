<?php

declare(strict_types=1);

namespace AsyncApi\Models;

use PHPUnit\Framework\TestCase;

final class NestedObjectTest extends TestCase
{
    public function testItInstantiates(): void
    {
        $address = new NestedObject();
        $this->assertInstanceOf(NestedObject::class, $address);
    }
}
